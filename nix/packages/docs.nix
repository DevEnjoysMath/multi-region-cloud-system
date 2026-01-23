{ self, ... }:
{
  perSystem =
    { pkgs, self', ... }:
    let
      docs = pkgs.stdenvNoCC.mkDerivation (finalAttrs: {
        name = "options-doc-html";
        src = self;

        nativeBuildInputs = [
          pkgs.mdbook
        ];

        dontBuild = true;
        installPhase = ''
          mkdir -p "$out/share/docs"

          mdbook build ./docs --dest-dir "$out/share/docs"

          rm "$out/share/docs/frontend" -rf
          rm "$out/share/docs/backend" -rf

          ln -sf "${self'.packages.frontend-docs}/share/docs/frontend" "$out/share/docs"
          ln -sf "${self'.packages.backend-docs}/share/docs/backend" "$out/share/docs"
        '';

        passthru.serve = pkgs.writeShellApplication {
          name = "serve-docs";
          runtimeInputs = [ pkgs.http-server ];
          text = ''
            exec http-server "${finalAttrs.finalPackage}/share/docs"
          '';
        };
      });
    in
    {
      packages = { inherit docs; };
      checks = { inherit docs; };
    };
}
