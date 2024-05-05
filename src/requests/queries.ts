export const query = `query ExampleQuery{
  anchors { 
    id
    anchor_name
    address_string
    attachments
    building_id
    campus_id
    end_at
    floor_nr
    group_id
    lat
    lon
    room_id
    start_at
    tags
    valid_from
    valid_until
  }
}`;

// default: anchor_name owner_id id created_at