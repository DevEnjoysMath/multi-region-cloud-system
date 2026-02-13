{ self, lib, ... }:
# Citus worker node configuration
{
  flake.nixosModules.docsServer =
    { pkgs, ... }:
    let
      inherit (pkgs.stdenv.hostPlatform) system;

      docs = pkgs.writeShellApplication {
        name = "docs-prod";
        runtimeInputs = [ pkgs.http-server ];
        text = ''
          exec http-server "${self.packages.${system}.docs}/share/docs" -a 0.0.0.0 -p 80
        '';
      };
    in
    {
      networking.firewall.allowedTCPPorts = [ 80 ];

      systemd.services.docs = {
        enable = true;
        description = "Docs Web Server";
        after = [
          "network.target"
        ];
        wantedBy = [ "multi-user.target" ];

        serviceConfig = {
          ExecStart = lib.getExe docs;

          DynamicUser = true;

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
          CapabilityBoundingSet = [ "CAP_NET_BIND_SERVICE" ];
          AmbientCapabilities = [ "CAP_NET_BIND_SERVICE" ];
          ProtectProc = "invisible";
        };
      };
    };
}
