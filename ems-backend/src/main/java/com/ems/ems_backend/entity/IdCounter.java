package com.ems.ems_backend.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "id_counter")
public class IdCounter {
    @Id
    private String id;
    private Long sequenceValue;

    public IdCounter() {}

    public IdCounter(String id, Long sequenceValue) {
        this.id = id;
        this.sequenceValue = sequenceValue;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getSequenceValue() {
        return sequenceValue;
    }

    public void setSequenceValue(Long sequenceValue) {
        this.sequenceValue = sequenceValue;
    }
}
