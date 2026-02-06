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
      cfg = config.services.postgres-distributed;
    in
    {
      options.services.postgres-distributed = {
        enable = lib.mkEnableOption "Distributed PostgreSQL with Citus";

        isCoordinator = lib.mkOption {
          description = "Whether this node is the Citus coordinator";
          type = lib.types.bool;
          default = false;
        };

        coordinatorAddress = lib.mkOption {
          description = "Address of the Citus coordinator node";
          type = lib.types.str;
          default = "localhost";
        };

        workerNodes = lib.mkOption {
          description = "List of worker node addresses";
          type = lib.types.listOf lib.types.str;
          default = [ ];
        };
      };

      config = lib.mkIf cfg.enable {
        services.postgresql = {
          enable = true;
          package = pkgs.postgresql_16.withPackages (ps: [ ps.citus ]);
          settings = {
            shared_preload_libraries = "citus";
            listen_addresses = lib.mkDefault "*";
          };
          authentication = lib.mkForce ''
            local all all trust
            host all all 127.0.0.1/32 trust
            host all all ::1/128 trust
            host all all 100.64.0.0/10 trust
            host all all 192.168.0.0/16 trust
            host all all 10.0.0.0/8 trust
          '';
        };

        networking.firewall.allowedTCPPorts = [ 5432 ];
      };
    };
}
