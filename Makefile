default:
	cd themes/palebluepixel/ && find src/less -name '*.less' | entr npm run build &
	cd -
	hugo server

clean:
	rm -rf public

dev:
	cd themes/palebluepixel/ && find src/less -name '*.less' | entr npm run build &
	cd -
	hugo server -D

build: clean
	cd themes/palebluepixel/ && npm run build
	cd -
	hugo

github: build
	echo "clayto.com" > public/CNAME
	ghp-import -m "generate Hugo site" -b gh-pages public
	git push origin gh-pages
