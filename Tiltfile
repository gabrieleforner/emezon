docker_build('emezon:user-api',  'user_api',      live_update=[ sync('./user_api/', '/user_api/src'), run('npm install', trigger=['package.json'])])
#docker_build('emezon:cart-api',    'cart_api',   live_update=[ sync('./cart_api/', '/cart_api/src'), run('npm install', trigger=['package.json'])])
#docker_build('emezon:catalog-api', 'catalog_api',live_update=[ sync('./catalog_api/', '/catalog_api/src'), run('npm install', trigger=['package.json'])])

k8s_yaml(helm('./charts/emezon'))

# Debug ports expose
k8s_resource('user-api', port_forwards=[9229])
#k8s_resource('cart', port_forwards=[9230])
#k8s_resource('catalog', port_forwards=[9231])