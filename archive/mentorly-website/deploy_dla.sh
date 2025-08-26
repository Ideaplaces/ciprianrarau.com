#!/usr/bin/env bash

aws ecr get-login-password --region us-gov-west-1 --profile dla | sudo docker login --username AWS --password-stdin  036336933307.dkr.ecr.us-gov-west-1.amazonaws.com
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://mentorly-api.dlataas.com \
  --build-arg NEXT_PUBLIC_BASE_URL=https://mentorly.dlataas.com \
  --build-arg NEXT_PUBLIC_COOKIE_DOMAIN=mentorly.dlataas.com \
  -t mentorly-website .

sudo docker tag mentorly-website:latest 036336933307.dkr.ecr.us-gov-west-1.amazonaws.com/mentorly-website:latest
sudo docker push 036336933307.dkr.ecr.us-gov-west-1.amazonaws.com/mentorly-website:latest
