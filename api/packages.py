import os

def install_packages():
  os.system('pip install flask')
  os.system('pip install flask-cors')
  os.system('pip3 install torch torchvision --index-url https://download.pytorch.org/whl/cu118')
  
  print('Finished installing packages.')
  
install_packages()