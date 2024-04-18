
// If the anchor type definition is changed, changes need to be applied here as well:
export const create_mutation = `mutation CreateAnchor($anchor: AnchorInput!){
    createAnchor(anchor: $anchor) {
    id
    anchor_name
    anchor_description
    tags
    attachments
    created_at
    updated_at
    start_at
    end_at
    valid_from
    valid_until
    lat
    lon
    alt
    campus_id
    address_string
    building_id
    faculty_name
    floor_nr
    room_id
    loc_description
    loc_description_imgs
    ar_anchor_id
    group_id
    prev_anchor_id
    next_anchor_id
    owner {
        id
        name
    }
    owner_group_id
    private_anchor
    }
}`;

export const delete_mutation = `mutation DeleteAnchor($deleteAnchorId: String!){
    deleteAnchor(id: $deleteAnchorId) 
}`;

// If the anchor type definition is changed, changes need to be applied here as well:
export const update_mutation = `mutation UpdateAnchor($anchor: AnchorInput!){
    updateAnchor(anchor: $anchor) {
    id
    anchor_name
    anchor_description
    tags
    attachments
    created_at
    updated_at
    start_at
    end_at
    valid_from
    valid_until
    lat
    lon
    alt
    campus_id
    address_string
    building_id
    faculty_name
    floor_nr
    room_id
    loc_description
    loc_description_imgs
    ar_anchor_id
    group_id
    prev_anchor_id
    next_anchor_id
    owner {
        id
        name
    }
    owner_group_id
    private_anchor
    }
}`;