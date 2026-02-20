{ self, ... }:
let
  openapiSpec = "${self}/specs/openapi.yaml";
in
{
  perSystem =
    { pkgs, inputs', ... }:
    {
      checks.healthCheck = pkgs.testers.runNixOSTest {
        name = "health-check";
        nodes.machine = {
          imports = [
            self.nixosModules.backend
          ];
          environment.systemPackages = [
            inputs'.haskemathesis.packages.default
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

          # Property testing
          machine.succeed("""
            haskemathesis-cli test \
              --url http://localhost:8080/api \
              --spec "${openapiSpec}" \
          """)
          machine.succeed("""
            haskemathesis-cli test \
              --url http://localhost:8080/api \
              --spec "${openapiSpec}" \
              --negative
          """)
          machine.succeed("""
            haskemathesis-cli test \
              --url http://localhost:8080/api \
              --spec "${openapiSpec}" \
              --stateful
          """)

          print("Yippie Backend works!")
        '';
      };
    };
}
