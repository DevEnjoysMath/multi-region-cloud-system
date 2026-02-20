package com.sweng.backend.config;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import java.io.IOException;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;

/** Web configuration for handling trailing slashes. */
@Configuration
public class WebConfig {

  /** Default constructor. */
  public WebConfig() {}

  /**
   * Filter that strips trailing slashes from request URIs. This ensures that /api/restaurants/ is
   * treated the same as /api/restaurants.
   *
   * @return the filter registration bean
   */
  // Disabled - handling trailing slashes explicitly in controllers instead
  // @Bean
  public FilterRegistrationBean<Filter> trailingSlashFilterDisabled() {
    FilterRegistrationBean<Filter> registration = new FilterRegistrationBean<>();
    registration.setFilter(new TrailingSlashFilter());
    registration.addUrlPatterns("/*");
    registration.setOrder(Ordered.HIGHEST_PRECEDENCE);
    return registration;
  }

  private static class TrailingSlashFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
        throws IOException, ServletException {
      HttpServletRequest httpRequest = (HttpServletRequest) request;
      String uri = httpRequest.getRequestURI();

      // Only strip trailing slash for collection endpoints (e.g., /api/restaurants/)
      // but NOT for endpoints expecting a path parameter (e.g., /api/restaurants/{id}/)
      // We detect this by checking if the path matches a known collection pattern
      if (uri.length() > 1 && uri.endsWith("/") && isCollectionPath(uri)) {
        String newUri = uri.substring(0, uri.length() - 1);
        HttpServletRequest wrappedRequest =
            new HttpServletRequestWrapper(httpRequest) {
              @Override
              public String getRequestURI() {
                return newUri;
              }

              @Override
              public String getServletPath() {
                String servletPath = httpRequest.getServletPath();
                if (servletPath.length() > 1 && servletPath.endsWith("/")) {
                  return servletPath.substring(0, servletPath.length() - 1);
                }
                return servletPath;
              }

              @Override
              public StringBuffer getRequestURL() {
                StringBuffer url = httpRequest.getRequestURL();
                return new StringBuffer(url.substring(0, url.length() - 1));
              }
            };
        chain.doFilter(wrappedRequest, response);
      } else {
        chain.doFilter(request, response);
      }
    }

    private boolean isCollectionPath(String uri) {
      // Only normalize trailing slash for known collection endpoints
      // These are endpoints that have both GET (list) and POST (create) on the base path
      return uri.equals("/api/restaurants/")
          || uri.equals("/api/orders/")
          || uri.equals("/api/auth/");
    }
  }
}
