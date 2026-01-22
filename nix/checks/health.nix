{ self, ... }:
{
  perSystem =
    { pkgs, ... }:
    {
      checks.healthCheck = pkgs.testers.runNixOSTest {
        name = "health-check";
        nodes.machine = {
          imports = [
            self.nixosModules.backend
          ];

          services.backend.enable = true;
        };

        testScript = ''
          machine.wait_for_unit("backend.target")
          machine.succeed("""
            curl http://localhost:8080/actuator/health | grep -o \"UP\"
          """)
        '';
      };
    };
}
