{
  perSystem =
    { pkgs, self', ... }:
    let
      index = pkgs.runCommandLocal "docs-index" { } ''
        mkdir -p "$out/share/docs"

        cp ${./docs/index.html} $out/share/docs/index.html
      '';
    in
    rec {
      packages.docs = pkgs.symlinkJoin {
        name = "docs";
        paths = [
          self'.packages.backend-docs
          self'.packages.frontend-docs
          index
        ];

        passthru.serve = pkgs.writeShellApplication {
          name = "serve-docs";
          runtimeInputs = [ pkgs.http-server ];
          text = ''
            exec http-server "${packages.docs}/share/docs"
          '';
        };
      };
      checks.docs = packages.docs;
    };
}
