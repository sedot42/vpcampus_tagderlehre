// Update mutations on changes; otherwise the requests will fail silently
export type Anchor = {
    id?: string;
    anchor_name: string;
    anchor_description?: string;
    tags?: string[];
    attachments?: string[];

    // temporal fields:
    created_at?: string;
    updated_at?: string;
    start_at?: string;
    end_at?: string;
    valid_from?: string;
    valid_until?: string;

    // spatial fields:
    lat?: number;
    lon?: number;
    alt?: number;
    campus_id?: string;
    address_string?: string;
    building_id?: string;
    faculty_name?: string;
    floor_nr?: number;
    room_id?: string;
    loc_description?: string;
    loc_description_imgs?: string[];
    ar_anchor_id?: string;

    // relational fields:
    group_id?: string;
    prev_anchor_id?: string;
    next_anchor_id?: string;

    // A&A fields:
    owner_id: string;
    owner_group_id?: string;
    private_anchor?: boolean


}