package com.sweng.backend.restaurant.dto;

import java.util.List;

/** DTO representing a paginated list of restaurants. */
public class RestaurantPageDto {

  private List<RestaurantDto> content;
  private long totalElements;
  private int totalPages;
  private int number;
  private int size;

  /** Default constructor for serialization. */
  public RestaurantPageDto() {}

  /**
   * Constructs a page DTO with all fields.
   *
   * @param content the list of restaurants
   * @param totalElements the total number of elements
   * @param totalPages the total number of pages
   * @param number the current page number
   * @param size the page size
   */
  public RestaurantPageDto(
      List<RestaurantDto> content, long totalElements, int totalPages, int number, int size) {
    this.content = content;
    this.totalElements = totalElements;
    this.totalPages = totalPages;
    this.number = number;
    this.size = size;
  }

  /**
   * Gets the list of restaurants.
   *
   * @return the list of restaurants
   */
  public List<RestaurantDto> getContent() {
    return content;
  }

  /**
   * Sets the list of restaurants.
   *
   * @param content the list of restaurants to set
   */
  public void setContent(List<RestaurantDto> content) {
    this.content = content;
  }

  /**
   * Gets the total number of elements.
   *
   * @return the total number of elements
   */
  public long getTotalElements() {
    return totalElements;
  }

  /**
   * Sets the total number of elements.
   *
   * @param totalElements the total number of elements to set
   */
  public void setTotalElements(long totalElements) {
    this.totalElements = totalElements;
  }

  /**
   * Gets the total number of pages.
   *
   * @return the total number of pages
   */
  public int getTotalPages() {
    return totalPages;
  }

  /**
   * Sets the total number of pages.
   *
   * @param totalPages the total number of pages to set
   */
  public void setTotalPages(int totalPages) {
    this.totalPages = totalPages;
  }

  /**
   * Gets the current page number.
   *
   * @return the current page number
   */
  public int getNumber() {
    return number;
  }

  /**
   * Sets the current page number.
   *
   * @param number the current page number to set
   */
  public void setNumber(int number) {
    this.number = number;
  }

  /**
   * Gets the page size.
   *
   * @return the page size
   */
  public int getSize() {
    return size;
  }

  /**
   * Sets the page size.
   *
   * @param size the page size to set
   */
  public void setSize(int size) {
    this.size = size;
  }
}
