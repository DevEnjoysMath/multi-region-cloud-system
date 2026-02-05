# Grafana dashboard visualization
_: {
  flake.nixosModules.grafana =
    { config, lib, ... }:
    let
      cfg = config.services.toast-grafana;
    in
    {
      options.services.toast-grafana = {
        enable = lib.mkEnableOption "Grafana dashboards";

        prometheusUrl = lib.mkOption {
          description = "URL of the Prometheus server";
          type = lib.types.str;
          default = "http://localhost:9090";
        };

        lokiUrl = lib.mkOption {
          description = "URL of the Loki server";
          type = lib.types.str;
          default = "http://localhost:3100";
        };
      };

      config = lib.mkIf cfg.enable {
        services.grafana = {
          enable = true;

          settings = {
            server = {
              http_addr = "0.0.0.0";
              http_port = 3000;
            };

            # disable auth for internal use (behind tailscale)
            "auth.anonymous" = {
              enabled = true;
              org_role = "Viewer";
            };
          };

          provision = {
            enable = true;

            datasources.settings.datasources = [
              {
                name = "Prometheus";
                type = "prometheus";
                url = cfg.prometheusUrl;
                isDefault = true;
              }
              {
                name = "Loki";
                type = "loki";
                url = cfg.lokiUrl;
              }
            ];
          };
        };
      };
    };
}
