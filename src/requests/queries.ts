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
    anchor_description
  }
}`;

export const getUserQuery = `query GetUserData($userId: String!) {
  user(id: $userId) {
    bookmarked_anchors {
      id
    }
    id
    name
    owned_anchors {
      id
    }
  }
}
`;
