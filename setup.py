from setuptools import find_packages, setup

setup(
    name='TraChat',
    description='Chat on Trac',
    url='http://www.kanasansoft.com/',
    license='New BSD License',
    author='Kanasansoft',
    version='0.1',
    packages=find_packages(exclude=['*.tests*']),
    entry_points = """
        [trac.plugins]
        trachat = trachat
    """,
    package_data={'trachat': ['templates/*.html',
                              'htdocs/js/*.js',
                              'htdocs/css/*.css',
                              'htdocs/images/*']},
)
