# ut-store

## Notes

```js
dev.start();

const channel = dev.store.state.value.channels.find(
  (channel) => channel.id === location.toString().split("/").at(-1)
);

const users = [];

for (const user of channel.users) {
  users.push({
    id: user.id,
    publicKey: btoa(String.fromCharCode(...user.publicKey)),
  });
}

users.push({
  id: dev.store.state.value.user.id,
  publicKey: btoa(
    String.fromCharCode(...dev.store.state.value.config.publicKey)
  ),
});

console.log(
  JSON.stringify({
    token: btoa(String.fromCharCode(...dev.store.state.value.config.token)),
    privateKey: btoa(
      String.fromCharCode(...dev.store.state.value.config.privateKey)
    ),
    channel: {
      id: channel.id,
      users,
    },
  })
);
```
