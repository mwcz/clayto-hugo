PfeIcon.addIconSet(
  "far",
  "/icons/font-awesome/regular",
  (iconName, setName, path) => {
    const name = iconName.replace("far-", "");
    return `${path}/${name}.svg`;
  }
);

PfeIcon.addIconSet(
  "fas",
  "/icons/font-awesome/solid",
  (iconName, setName, path) => {
    const name = iconName.replace("fas-", "");
    return `${path}/${name}.svg`;
  }
);

PfeIcon.addIconSet(
  "fab",
  "/icons/font-awesome/brands",
  (iconName, setName, path) => {
    const name = iconName.replace("fab-", "");
    return `${path}/${name}.svg`;
  }
);
