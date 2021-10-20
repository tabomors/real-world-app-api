build-image:
	docker build -t tabomors/real-world-app-api .

push-image:
	docker push tabomors/real-world-app-api
