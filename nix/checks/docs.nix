{ self, ... }:
{
  perSystem =
    { pkgs, ... }:
    {
      checks.docsHealthCheck = pkgs.testers.runNixOSTest {
        name = "docs-health-check";
        nodes.machine = {
          imports = [
            self.nixosModules.docsServer
          ];
        };

        testScript = ''
          machine.wait_for_unit("docs.service")
          machine.wait_for_open_port(80)
          machine.succeed("""
            curl http://0.0.0.0:80 | grep -o \"Multi Region Cloud System\"
          """)
        '';
      };
    };
}
