import low from "lowdb";
import gcloud from './cloud'

const adapter = new gcloud();
low(adapter).then((db) => db.defaults({ opencollective: [] })
.write());

export default low(adapter);
