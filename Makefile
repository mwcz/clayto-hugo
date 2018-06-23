default:
	cd themes/palebluepixel/ && find src/less -name '*.less' | entr npm run build &
	cd -
	hugo server

dev:
	cd themes/palebluepixel/ && find src/less -name '*.less' | entr npm run build &
	cd -
	hugo server -D
