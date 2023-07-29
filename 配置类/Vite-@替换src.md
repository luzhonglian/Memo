## vite.config.js

```javascript
import { resolve } from "path";
const pathResolve = (dir) => resolve(__dirname, dir);

export default defineConfig({
  resolve: {
    alias: {
      "@": pathResolve("src"),
    },
  },
});
```
