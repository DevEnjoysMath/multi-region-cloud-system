# Distributed PostgreSQL with Citus extension
_: {
  flake.nixosModules.postgres =
    {
      config,
      lib,
      pkgs,
      ...
    }:
    let
      inherit (lib) types mkOption mkEnableOption;

      cfg = config.services.postgres-distributed;

      # PostgreSQL with Citus extension
      postgresWithCitus = pkgs.postgresql_17.withPackages (ps: [
        ps.citus
      ]);
    in
    {
      options.services.postgres-distributed = {
        enable = mkEnableOption "Distributed PostgreSQL with Citus";

        isCoordinator = mkOption {
          description = ''
            Whether this node is the Citus coordinator.
            Set to false for worker nodes.
          '';
          type = types.bool;
        };

        coordinatorAddress = mkOption {
          description = ''
            Address of the Citus coordinator node.
            Only used on worker nodes to register with the coordinator.
          '';
          type = types.str;
          default = "127.0.0.1";
        };

        workerNodes = mkOption {
          description = ''
            List of worker node addresses to add to the coordinator.
            Only used when isCoordinator is true.
          '';
          type = types.listOf types.str;
          default = [ ];
          example = [
            "10.0.0.2"
            "10.0.0.3"
          ];
        };

        listenAddresses = mkOption {
          description = ''
            Addresses to listen on. Use "*" to listen on all interfaces.
          '';
          type = types.str;
          default = "*";
        };

        port = mkOption {
          description = ''
            PostgreSQL port.
          '';
          type = types.port;
          default = 5432;
        };

        database = mkOption {
          description = ''
            Database configuration.
          '';
          type = types.submodule {
            options = {
              name = mkOption {
                description = "Database name.";
                type = types.str;
                default = "CSU33012";
              };
              user = mkOption {
                description = "Database user.";
                type = types.str;
                default = "scss";
              };
              password = mkOption {
                description = ''
                  Database initial password.
                  A real production system would use secrets management.
                '';
                type = types.str;
                default = "scss";
              };
            };
          };
          default = { };
        };
      };

      config = lib.mkIf cfg.enable {
        # Open firewall for PostgreSQL
        networking.firewall.allowedTCPPorts = [ cfg.port ];

        services.postgresql = {
          enable = true;
          package = postgresWithCitus;
          enableTCPIP = true;

          settings = {
            shared_preload_libraries = "citus";
            listen_addresses = cfg.listenAddresses;
            inherit (cfg) port;

            # Citus recommended settings
            "citus.node_conninfo" = "sslmode=prefer";

            # Connection settings for distributed queries
            max_connections = 300;

            # Memory settings (adjust based on available RAM)
            shared_buffers = "256MB";
            effective_cache_size = "768MB";
            work_mem = "16MB";
            maintenance_work_mem = "128MB";
          };

          authentication = ''
            # Allow local connections
            local   all             all                                     trust
            # Allow connections from any host with password
            host    all             all             0.0.0.0/0               scram-sha-256
            host    all             all             ::/0                    scram-sha-256
          '';

          initialScript = pkgs.writeText "postgres-init" ''
            -- Create superuser for administration
            CREATE USER postgres SUPERUSER PASSWORD 'postgres';

            -- Create application user and database
            CREATE USER ${cfg.database.user} WITH PASSWORD '${cfg.database.password}';
            CREATE DATABASE ${cfg.database.name} OWNER ${cfg.database.user};

            -- Connect to the application database and set up Citus
            \c ${cfg.database.name}
            CREATE EXTENSION IF NOT EXISTS citus;

            -- Grant necessary permissions
            GRANT ALL PRIVILEGES ON DATABASE ${cfg.database.name} TO ${cfg.database.user};
          '';
        };

        # Service to configure Citus cluster after PostgreSQL starts
        systemd.services.citus-setup = {
          enable = true;
          description = "Configure Citus distributed database cluster";
          after = [ "postgresql.service" ];
          requires = [ "postgresql.service" ];
          wantedBy = [ "multi-user.target" ];

          serviceConfig = {
            Type = "oneshot";
            RemainAfterExit = true;
            User = "postgres";
          };

          script =
            let
              psql = lib.getExe' postgresWithCitus "psql";
              dbName = cfg.database.name;
            in
            if cfg.isCoordinator then
              ''
                # Set this node as coordinator
                ${psql} -d ${dbName} -c "SELECT citus_set_coordinator_host('${cfg.coordinatorAddress}', ${toString cfg.port});"

                # Add worker nodes
                ${lib.concatMapStringsSep "\n" (worker: ''
                  ${psql} -d ${dbName} -c "SELECT * FROM citus_add_node('${worker}', ${toString cfg.port});"
                '') cfg.workerNodes}

                echo "Citus coordinator configured with ${toString (builtins.length cfg.workerNodes)} worker(s)"
              ''
            else
              ''
                # Worker nodes just need to ensure citus extension is loaded
                # They will be added by the coordinator
                echo "Citus worker node ready at ${cfg.coordinatorAddress}:${toString cfg.port}"
              '';
        };
      };
    };
}
