// Update mutations on changes; otherwise the requests will fail silently

// compatibility type because frontend expects flat object
export type DBAnchor = Omit<Anchor, "owner_id"> & {
  owner: {
    id: string;
    name?: string;
  };
};

// (DB)Anchor with optional id field
export type DraftAnchor<T extends Anchor | DBAnchor> = Omit<T, "id"> &
  Partial<Pick<T, "id">>;

// overload so TS infers the correct type. begin with most narrow to widest.
export function convertFlatAnchorToDBAnchor(anchor: Anchor): DBAnchor;
export function convertFlatAnchorToDBAnchor(
  anchor: DraftAnchor<Anchor>
): DraftAnchor<DBAnchor>;
export function convertFlatAnchorToDBAnchor(
  anchor: Anchor | DraftAnchor<Anchor>
): DBAnchor | DraftAnchor<DBAnchor> {
  const { owner_id, ...dbAnchor } = anchor;
  return {
    ...dbAnchor,
    owner: {
      id: owner_id,
    },
  };
}

export function convertDBAnchorToFlatAnchor(anchor: DBAnchor): Anchor;
export function convertDBAnchorToFlatAnchor(
  anchor: DraftAnchor<DBAnchor> | DBAnchor
): DraftAnchor<Anchor> | Anchor {
  const { owner, ...flatAnchor } = anchor;
  return {
    ...flatAnchor,
    owner_id: owner.id,
    owner_name: owner.name,
  };
}

export type Anchor = {
  id: string;
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
  owner_name?: string;
  owner_group_id?: string;
  private_anchor?: boolean;
};

// typeguard
export function isDBAnchor(anchor: DBAnchor | DraftAnchor<DBAnchor>): anchor is DBAnchor {
  return anchor.id !== undefined && anchor.owner.id !== undefined;
}
