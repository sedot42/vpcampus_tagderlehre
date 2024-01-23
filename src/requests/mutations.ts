
export const create_mutation = `mutation CreateAnchor($anchor: AnchorInput){
    createAnchor(anchor: $anchor) {
        anchor_name
        owner_id
        created_at
    }
}`;

export const delete_mutation = `mutation DeleteAnchor($deleteAnchorId: String!){
    deleteAnchor(id: $deleteAnchorId) 
}`;

export const update_mutation = `mutation UpdateAnchor($anchor: AnchorInput){
    updateAnchor(anchor: $anchor) {
        id
        anchor_name
        owner_id
    }
}`;