package com.youssef.cinebook.DTO;

public class SeatDTO {
    private Long id;
    private Character row;
    private Integer column;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Character getRow() {
        return row;
    }

    public void setRow(Character row) {
        this.row = row;
    }

    public Integer getColumn() {
        return column;
    }

    public void setColumn(Integer column) {
        this.column = column;
    }
}
