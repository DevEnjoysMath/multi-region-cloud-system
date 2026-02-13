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
          services.postgresql = {
            enable = true;
            ensureDatabases = [ "sweng" ];
            ensureUsers = [
              {
                name = "postgres";
              }
            ];
            authentication = pkgs.lib.mkOverride 10 ''
              local all all trust
              host all all 127.0.0.1/32 trust
              host all all ::1/128 trust
            '';
          };
          services.backend.enable = true;
        };
        testScript = ''
          machine.wait_for_unit("postgresql.service")
          machine.wait_for_unit("backend.service")
          machine.wait_for_open_port(8080)
          machine.succeed("""
            curl http://localhost:8080/actuator/health | grep -o \"UP\"
          """)
          print("Yippie Backend works!")
        '';
      };
    };
}
