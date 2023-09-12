
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