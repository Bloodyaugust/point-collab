import PocketBase from "pocketbase";

const pocketBase = new PocketBase(import.meta.env.PUBLIC_POCKETBASE_URL);

export default pocketBase;
