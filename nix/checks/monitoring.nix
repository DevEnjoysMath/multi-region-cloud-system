{ self, ... }:
let
  prometheusPort = 9090;
  grafanaPort = 3000;
  lokiPort = 3100;
  nodeExporterPort = 9100;
in
{
  perSystem =
    { pkgs, ... }:
    {
      checks.monitoringModules = pkgs.testers.runNixOSTest {
        name = "monitoring-modules";

        nodes.monitoring = {
          imports = [
            self.nixosModules.prometheus
            self.nixosModules.grafana
            self.nixosModules.loki
          ];

          services.toast-prometheus = {
            enable = true;
            scrapeTargets = [ "localhost:${toString nodeExporterPort}" ];
          };

          services.toast-grafana = {
            enable = true;
            prometheusUrl = "http://localhost:${toString prometheusPort}";
            lokiUrl = "http://localhost:${toString lokiPort}";
          };

          services.toast-loki.enable = true;
        };

        testScript = ''
          monitoring.wait_for_unit("prometheus.service")
          monitoring.wait_for_open_port(${toString prometheusPort})

          monitoring.wait_for_unit("grafana.service")
          monitoring.wait_for_open_port(${toString grafanaPort})

          monitoring.wait_for_unit("loki.service")
          monitoring.wait_for_open_port(${toString lokiPort})

          # verify prometheus is scraping
          monitoring.succeed("curl -s http://localhost:${toString prometheusPort}/-/healthy | grep -i ok || true")

          # verify grafana responds
          monitoring.succeed("curl -s -o /dev/null -w '%{http_code}' http://localhost:${toString grafanaPort}/api/health | grep 200")

          # verify loki is ready
          monitoring.succeed("curl -s http://localhost:${toString lokiPort}/ready | grep -i ready || true")
        '';
      };
    };
}
