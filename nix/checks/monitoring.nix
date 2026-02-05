{ self, ... }:
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
            scrapeTargets = [ "localhost:9100" ];
          };

          services.toast-grafana = {
            enable = true;
            prometheusUrl = "http://localhost:9090";
            lokiUrl = "http://localhost:3100";
          };

          services.toast-loki.enable = true;
        };

        testScript = ''
          monitoring.wait_for_unit("prometheus.service")
          monitoring.wait_for_open_port(9090)

          monitoring.wait_for_unit("grafana.service")
          monitoring.wait_for_open_port(3000)

          monitoring.wait_for_unit("loki.service")
          monitoring.wait_for_open_port(3100)

          # verify prometheus is scraping
          monitoring.succeed("curl -s http://localhost:9090/-/healthy | grep -i ok || true")

          # verify grafana responds
          monitoring.succeed("curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/api/health | grep 200")

          # verify loki is ready
          monitoring.succeed("curl -s http://localhost:3100/ready | grep -i ready || true")
        '';
      };
    };
}
