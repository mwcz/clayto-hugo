PfeIcon.addIconSet("fa", "/icons/font-awesome", (iconName, setName, path) => {
  const [, subset, icon] = /.*?-(.*?)-(.*)/.exec(iconName);
  return { iconPath: `${path}/${subset}/${icon}.svg` };
});
