# Loki log aggregation
_:
{
  flake.nixosModules.loki =
    { config, lib, ... }:
    let
      cfg = config.services.toast-loki;
    in
    {
      options.services.toast-loki = {
        enable = lib.mkEnableOption "Loki log aggregation";
      };

      config = lib.mkIf cfg.enable {
        services.loki = {
          enable = true;

          configuration = {
            auth_enabled = false;

            server = {
              http_listen_port = 3100;
            };

            ingester = {
              lifecycler = {
                address = "127.0.0.1";
                ring = {
                  kvstore.store = "inmemory";
                  replication_factor = 1;
                };
                final_sleep = "0s";
              };
              chunk_idle_period = "5m";
              chunk_retain_period = "30s";
            };

            schema_config = {
              configs = [
                {
                  from = "2024-01-01";
                  store = "boltdb";
                  object_store = "filesystem";
                  schema = "v11";
                  index = {
                    prefix = "index_";
                    period = "168h";
                  };
                }
              ];
            };

            storage_config = {
              boltdb.directory = "/var/lib/loki/index";
              filesystem.directory = "/var/lib/loki/chunks";
            };

            limits_config = {
              enforce_metric_name = false;
              reject_old_samples = true;
              reject_old_samples_max_age = "168h";
            };
          };
        };

        # promtail to ship logs to loki
        services.promtail = {
          enable = true;

          configuration = {
            server = {
              http_listen_port = 9080;
              grpc_listen_port = 0;
            };

            positions.filename = "/var/lib/promtail/positions.yaml";

            clients = [
              {
                url = "http://localhost:3100/loki/api/v1/push";
              }
            ];

            scrape_configs = [
              {
                job_name = "journal";
                journal = {
                  max_age = "12h";
                  labels = {
                    job = "systemd-journal";
                  };
                };
                relabel_configs = [
                  {
                    source_labels = [ "__journal__systemd_unit" ];
                    target_label = "unit";
                  }
                ];
              }
            ];
          };
        };
      };
    };
}
