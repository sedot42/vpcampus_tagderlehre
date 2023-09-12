
export const create_mutation = `mutation CreateAnchor($anchor: AnchorInput){
createAnchor(anchor: $anchor) {
anchor_name
owner_id
created_at
}
}`;

export const delete_mutation = `mutation DeleteAnchor($anchor: id){
deleteAnchor(id: $deleteAnchorId) {
anchor_name
id
}
}`;