{
  perSystem =
    { pkgs, ... }:
    let
      openapiSpec = ../../../specs/openapi.yaml;
    in
    rec {
      packages.openapi-docs =
        pkgs.runCommandLocal "openapi-docs"
          {
            nativeBuildInputs = [
              pkgs.redocly
            ];
          }
          ''
            redocly lint "${openapiSpec}" --lint-config error

            mkdir -p "$out/share/docs/openapi"

            redocly build-docs "${openapiSpec}" -o "$out/share/docs/openapi/index.html"
          '';
      checks.openapi-docs = packages.openapi-docs;
    };
}
