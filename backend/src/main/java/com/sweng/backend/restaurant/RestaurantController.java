package com.sweng.backend.restaurant;

import com.sweng.backend.restaurant.dto.CreateRestaurantRequest;
import com.sweng.backend.restaurant.dto.RestaurantDto;
import com.sweng.backend.restaurant.dto.RestaurantPageDto;
import com.sweng.backend.restaurant.dto.UpdateRestaurantRequest;
import com.sweng.backend.user.UserRepository;
import jakarta.validation.Valid;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.UUID;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

/** REST controller for restaurant CRUD endpoints. */
@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

  private final RestaurantRepository repository;
  private final UserRepository userRepository;

  /**
   * Creates a controller instance.
   *
   * @param repository the restaurant repository
   * @param userRepository the user repository
   */
  public RestaurantController(RestaurantRepository repository, UserRepository userRepository) {
    this.repository = repository;
    this.userRepository = userRepository;
  }

  /**
   * List restaurants with pagination.
   *
   * @param page the page number (0-indexed)
   * @param size the page size
   * @return paginated list of restaurants
   */
  @GetMapping
  public ResponseEntity<RestaurantPageDto> getRestaurants(
      @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "20") int size) {

    if (page < 0 || size < 1) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid page/size");
    }

    var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
    var p = repository.findByIsActiveTrue(pageable);

    var content = p.getContent().stream().map(RestaurantController::toDto).toList();

    RestaurantPageDto dto =
        new RestaurantPageDto(
            content, p.getTotalElements(), p.getTotalPages(), p.getNumber(), p.getSize());

    return ResponseEntity.ok(dto);
  }

  /**
   * Create a new restaurant.
   *
   * @param body the restaurant creation request
   * @return the created restaurant
   */
  @PostMapping
  public ResponseEntity<RestaurantDto> createRestaurant(
      @Valid @RequestBody CreateRestaurantRequest body) {
    String username = currentUsernameOr401();

    var owner =
        userRepository
            .findByUsername(username)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

    RestaurantEntity e = new RestaurantEntity();
    e.setName(body.getName());
    e.setDescription(body.getDescription());
    e.setAddress(body.getAddress());
    e.setPhone(body.getPhone());
    e.setEmail(body.getEmail());
    e.setCuisineType(body.getCuisineType());
    e.setOpeningHours(body.getOpeningHours());
    e.setOwnerId(owner.getUid());
    e.setActive(true);

    RestaurantEntity saved = repository.save(e);
    return ResponseEntity.status(HttpStatus.CREATED).body(toDto(saved));
  }

  /**
   * Handle GET with empty restaurantId (trailing slash) - return 400.
   *
   * @return never returns normally, throws 400 error
   */
  @GetMapping("/")
  public ResponseEntity<Void> getRestaurantNoId() {
    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "restaurantId is required");
  }

  /**
   * Get a specific restaurant by ID.
   *
   * @param restaurantId the restaurant ID
   * @return the restaurant details
   */
  @GetMapping("/{restaurantId}")
  public ResponseEntity<RestaurantDto> getRestaurant(@PathVariable String restaurantId) {
    UUID id = parseUuidOr400(restaurantId);
    RestaurantEntity found =
        repository
            .findById(id)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Restaurant not found"));
    return ResponseEntity.ok(toDto(found));
  }

  /**
   * Handle PUT with empty restaurantId - return 400.
   *
   * @return never returns normally, throws 400 error
   */
  @PutMapping({"", "/"})
  public ResponseEntity<Void> updateRestaurantNoId() {
    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "restaurantId is required");
  }

  /**
   * Update an existing restaurant.
   *
   * @param restaurantId the restaurant ID to update
   * @param body the update request body
   * @return the updated restaurant
   */
  @PutMapping("/{restaurantId}")
  public ResponseEntity<RestaurantDto> updateRestaurant(
      @PathVariable String restaurantId, @Valid @RequestBody UpdateRestaurantRequest body) {

    UUID id = parseUuidOr400(restaurantId);
    RestaurantEntity found =
        repository
            .findById(id)
            .orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Restaurant not found"));

    if (body.getName() != null) found.setName(body.getName());
    if (body.getDescription() != null) found.setDescription(body.getDescription());
    if (body.getAddress() != null) found.setAddress(body.getAddress());
    if (body.getPhone() != null) found.setPhone(body.getPhone());
    if (body.getEmail() != null) found.setEmail(body.getEmail());
    if (body.getCuisineType() != null) found.setCuisineType(body.getCuisineType());
    if (body.getOpeningHours() != null) found.setOpeningHours(body.getOpeningHours());
    if (body.getIsActive() != null) found.setActive(body.getIsActive());

    RestaurantEntity saved = repository.save(found);
    return ResponseEntity.ok(toDto(saved));
  }

  /**
   * Handle DELETE with empty restaurantId - return 400.
   *
   * @return never returns normally, throws 400 error
   */
  @DeleteMapping({"", "/"})
  public ResponseEntity<Void> deleteRestaurantNoId() {
    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "restaurantId is required");
  }

  /**
   * Delete a restaurant.
   *
   * @param restaurantId the restaurant ID to delete
   * @return 204 No Content on success
   */
  @DeleteMapping("/{restaurantId}")
  public ResponseEntity<Void> deleteRestaurant(@PathVariable String restaurantId) {
    UUID id = parseUuidOr400(restaurantId);

    if (!repository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Restaurant not found");
    }

    repository.deleteById(id);
    return ResponseEntity.noContent().build();
  }

  private static UUID parseUuidOr400(String raw) {
    try {
      return UUID.fromString(raw);
    } catch (IllegalArgumentException ex) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid restaurantId");
    }
  }

  private static String currentUsernameOr401() {
    var auth = SecurityContextHolder.getContext().getAuthentication();
    if (auth == null || !auth.isAuthenticated() || auth.getPrincipal() == null) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    // With your CustomUserDetailsService, principal username is available via auth.getName()
    String username = auth.getName();
    if (username == null || username.isBlank()) {
      throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }
    return username;
  }

  private static RestaurantDto toDto(RestaurantEntity e) {
    RestaurantDto dto = new RestaurantDto();
    dto.setId(e.getId().toString());
    dto.setName(e.getName());
    dto.setDescription(e.getDescription());
    dto.setAddress(e.getAddress());
    dto.setPhone(e.getPhone());
    dto.setEmail(e.getEmail());
    dto.setCuisineType(e.getCuisineType());
    dto.setOpeningHours(e.getOpeningHours());
    dto.setOwnerId(e.getOwnerId().toString());
    dto.setIsActive(e.isActive());
    dto.setCreatedAt(OffsetDateTime.ofInstant(e.getCreatedAt(), ZoneOffset.UTC));
    dto.setUpdatedAt(OffsetDateTime.ofInstant(e.getUpdatedAt(), ZoneOffset.UTC));
    return dto;
  }
}
