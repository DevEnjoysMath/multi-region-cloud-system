{ self, ... }:
{
  flake.nixosModules.backend =
    {
      config,
      lib,
      pkgs,
      ...
    }:
    let
      inherit (lib) types mkOption mkEnableOption;
      inherit (pkgs.stdenv.hostPlatform) system;

      cfg = config.services.backend;

      healthCheck = pkgs.writeShellApplication {
        name = "backend-health-check";
        runtimeInputs = with pkgs; [
          curl
        ];
        text = ''
          for _ in {1..300}; do
            if curl -s http://localhost:8080/actuator/health | grep -q "\"status\":\"UP\""; then
              exit 0
            fi
            sleep 1
          done
          echo "backend health check timed out"
          exit 1
        '';
      };
    in
    {
      options.services.backend = {
        enable = mkEnableOption "Last minute trip planning service";

        database = mkOption {
          description = ''
            backend database configuration.

            Defaults to the same values as a standard coder setup.
          '';
          type = types.submodule {
            options = {
              name = mkOption {
                description = ''
                  backend database name.
                '';
                type = types.str;
                default = "CSU33012";
              };
              user = mkOption {
                description = ''
                  backend database user.
                '';
                type = types.str;
                default = "scss";
              };
              password = mkOption {
                description = ''
                  backend database initial password.

                  A real production system would overwrite this to a run time generated one at launch.
                '';
                type = types.str;
                default = "scss";
              };
              addr = mkOption {
                description = ''
                  backend database ip address
                '';
                type = types.str;
                default = "127.0.0.1";
              };
            };
          };
          default = { };
        };
      };

      config = lib.mkIf cfg.enable {
        systemd.targets.backend = {
          description = "backend Service";
          wantedBy = [ "multi-user.target" ];
          requires = [ "backend-health.service" ];
        };

        systemd.services.backend-health = {
          enable = true;
          description = "Wait for backend to become healthy";
          after = [ "backend.service" ];
          wants = [ "backend.service" ];
          wantedBy = [ "backend.target" ];
          serviceConfig = {
            Type = "oneshot";
            ExecStart = lib.getExe healthCheck;
            RemainAfterExit = true;
          };
        };

        systemd.services.backend = {
          enable = true;
          description = "backend Web Server";
          after = [
            "network.target"
            "postgres.service"
          ];
          wantedBy = [ "multi-user.target" ];

          serviceConfig = {
            ExecStart = lib.getExe self.packages.${system}.backend;

            DynamicUser = true;
            CacheDirectory = "backend";
            WorkingDirectory = "/var/cache/backend";

            Restart = "always";

            RestrictRealtime = true;
            RestrictNamespaces = true;
            LockPersonality = true;
            ProtectKernelModules = true;
            ProtectKernelTunables = true;
            ProtectKernelLogs = true;
            ProtectControlGroups = true;
            ProtectClock = true;
            RestrictSUIDSGID = true;
            SystemCallArchitectures = "native";
            CapabilityBoundingSet = "";
            ProtectProc = "invisible";
          };
        };

        services.postgresql = {
          enable = true;
          initialScript = pkgs.writeText "psqlconf" ''
            CREATE USER postgres SUPERUSER PASSWORD 'postgres';
          '';
        };
      };
    };
}
