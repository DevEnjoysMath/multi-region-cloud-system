{
  perSystem =
    { pkgs, ... }:
    {
      packages.ci = pkgs.writeShellApplication {
        name = "ci";
        runtimeInputs = [
          pkgs.findutils
          pkgs.omnix
          pkgs.cachix
        ];
        inheritPath = true;
        text = ''
          test -n "$CACHIX_AUTH_TOKEN"

          echo "Logging in to cachix..."
          cachix authtoken "$CACHIX_AUTH_TOKEN"

          echo "Running CI..."
          om \
            ci run --include-all-dependencies \
            -- --accept-flake-config \
            | xargs cachix push sweng-group-26

          echo "CI finished successfully"
        '';
      };
    };
}
