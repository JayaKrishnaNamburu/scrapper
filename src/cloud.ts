import { Storage } from "@google-cloud/storage";
import { BUCKET_NAME, DB_FILE_NAME } from "./constants";

const stringify = obj => JSON.stringify(obj, null, 2);

class GoogleCloud {
  private bucket: any;
  private file: any;
  constructor(
    public source: string = "db.json",
    public defaultValue = {},
    public serialize = stringify,
    public deserialize = JSON.parse
  ) {
    const storage = new Storage();
    this.bucket = storage.bucket(BUCKET_NAME);
    this.file = this.bucket.file(DB_FILE_NAME);
  }

  public async read() {
    return new Promise((resolve, reject) => {
      this.file
        .download()
        .then(data => {
          const file = data[0];
          const contents = this.deserialize(file);
          resolve(contents);
        })
        .catch(err => {
          if (err.code === 404) {
            this.write(this.defaultValue)
              .then(() => resolve(this.defaultValue))
              .catch(reject);
          } else {
            reject(err);
          }
        });
    });
  }

  public async write(data) {
    try {
      const file = this.file;
      const contents = this.serialize(data);
      await file.save(contents, {
        metadata: {
          contentType: "application/json",
          cacheControl: "no-cache"
        }
      });
      return file;
    } catch (e) {
      console.error(e);
      throw Error("Something went wrong");
    }
  }
}

export default GoogleCloud;
