# Items that need doing

1. Development
  - Frontend
    - refactor navigation
    - clean profile pages
    - set up some common db of blog posts with ansballard.github.io
    - support for multiple profiles under one user
      - need to redo routing
      - ability to merge existing "users"
  - Backend
    - support for multiple profiles under one user
      - need to redo routing
      - ability to merge existing "users"
    - add support for fallout
      - diffing ini files
      - upgrade DB

```javascript
[{
  username: [{
    profilename: string
    plugins: [],
    modlist: [],
    ini: [],
    prefsini: [],
    timestamp: Date,
    game: [],
    se: [],
    enb: []
  }],
  default: string
}]
```
