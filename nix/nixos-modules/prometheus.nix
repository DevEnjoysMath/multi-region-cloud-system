# Prometheus metrics collection
{ ... }:
{
  flake.nixosModules.prometheus =
    { config, lib, ... }:
    let
      cfg = config.services.toast-prometheus;
    in
    {
      options.services.toast-prometheus = {
        enable = lib.mkEnableOption "Prometheus metrics collection";

        scrapeTargets = lib.mkOption {
          description = "List of targets to scrape metrics from";
          type = lib.types.listOf lib.types.str;
          default = [ ];
          example = [ "backend-a:8080" "backend-b:8080" ];
        };
      };

      config = lib.mkIf cfg.enable {
        services.prometheus = {
          enable = true;
          port = 9090;

          scrapeConfigs = [
            {
              job_name = "backend";
              static_configs = [{
                targets = cfg.scrapeTargets;
              }];
            }
            {
              job_name = "node";
              static_configs = [{
                targets = [ "localhost:9100" ];
              }];
            }
          ];
        };

        # node exporter for system metrics
        services.prometheus.exporters.node = {
          enable = true;
          port = 9100;
        };
      };
    };
}
