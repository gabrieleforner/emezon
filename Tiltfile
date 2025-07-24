docker_build(
   'emezon-user-service:dev',
   'backend/users/',
   live_update=[
       sync('backend/users/', '/users_service'),
       run('npm install', trigger=['package.json','package-lock.json'])
   ]
)
k8s_yaml(helm('./charts/emezon'))
k8s_resource('user-microservice', port_forwards=['9229:9229'])