
from fabric.api import *


env.hosts = ["odin"]
env.tarFile = "sunstone.tar.gz"
env.serverPath = "/var/www/sunstone/"
env.files = ("index.html", "media")


def tar():
	"""
	Create the tar file to send to the server.
	"""
	local("tar -ca -C dist -f %s %s" % (env.tarFile, " ".join(env.files)))


def deploy():
	tar()

	with cd(env.serverPath):
		put(env.tarFile, env.serverPath)
		run("tar -xf %s" % env.tarFile)
		run("rm -f %s" % env.tarFile)

	local("rm -f %s" % env.tarFile)
