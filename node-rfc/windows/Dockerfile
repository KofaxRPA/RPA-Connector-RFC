# escape=`

ARG SERVERCORE_VERSION=1909
FROM mcr.microsoft.com/dotnet/framework/sdk:4.8-windowsservercore-${SERVERCORE_VERSION}

ARG SAPNWRFC_HOME=nwrfcsdk
ARG NODE_VERSION=12.16.1
ARG GIT_VERSION=2.25.1
ARG CMAKE_VERSION=3.17.0
ARG VS_VERSION=16
ARG PY_VERSION=3.8.2

# Restore the default Windows shell for correct batch processing.
SHELL ["cmd", "/S", "/C"]

# Adds the build script
ADD build.ps1 C:\build.ps1

# Copy the NWSDK
COPY ${SAPNWRFC_HOME} C:\nwrfcsdk\

# Download the Build Tools bootstrapper
COPY BuildToolsInstall.cmd C:\TEMP\
ADD https://aka.ms/vscollect.exe C:\TEMP\collect.exe
ADD https://aka.ms/vs/${VS_VERSION}/release/vs_buildtools.exe C:\TEMP\vs_buildtools.exe

# Install Build Tools excluding workloads and components with known issues.
RUN C:\TEMP\BuildToolsInstall.cmd C:\TEMP\vs_buildtools.exe --quiet --wait --norestart --nocache `
	--installPath C:\BuildTools `
	--add "Microsoft.VisualStudio.Workload.VCTools;includeRecommended"

RUN del C:\TEMP\vs_buildtools.exe && del C:\TEMP\collect.exe && del C:\TEMP\BuildToolsInstall.cmd
 
# Download Git
ADD https://github.com/git-for-windows/git/releases/download/v${GIT_VERSION}.windows.1/MinGit-${GIT_VERSION}-64-bit.zip C:\TEMP\Mingit.zip

RUN mkdir C:\git && powershell -Command "expand-archive -Path 'C:\TEMP\Mingit.zip' -DestinationPath 'C:\git'" && del C:\TEMP\Mingit.zip

# Download Python
ADD https://www.python.org/ftp/python/${PY_VERSION}/python-${PY_VERSION}-embed-amd64.zip C:\TEMP\python.zip

RUN mkdir C:\python && powershell -Command "expand-archive -Path 'C:\TEMP\python.zip' -DestinationPath 'C:\python'" && del C:\TEMP\python.zip

# Download Node
ADD https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-win-x86.zip C:\TEMP\node.zip

RUN powershell -Command "expand-archive -Path 'C:\TEMP\node.zip' -DestinationPath 'C:\'" && del C:\TEMP\node.zip

ADD https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-headers.tar.gz C:\TEMP\node-headers.tar.gz

RUN tar -xzf C:\TEMP\node-headers.tar.gz -C C:\TEMP && del C:\TEMP\node-headers.tar.gz && powershell mv C:\TEMP\node-v"%NODE_VERSION%"\include C:\node-v"%NODE_VERSION%"-win-x86\ && rmdir C:\TEMP\node-v"%NODE_VERSION%" 

# Download CMake

ADD https://github.com/Kitware/CMake/releases/download/v${CMAKE_VERSION}/cmake-${CMAKE_VERSION}-win64-x64.zip C:\TEMP\CMake.zip

RUN powershell -Command "expand-archive -Path 'C:\TEMP\CMake.zip' -DestinationPath 'C:\'" && del C:\TEMP\CMake.zip

USER ContainerAdministrator
RUN setx /M PATH "%PATH%;C:\node-v"%NODE_VERSION%"-win-x86;C:\cmake-"%CMAKE_VERSION%"-win64-x64\bin;C:\git\cmd;C:\python" && setx /M SAPNWRFC_HOME "C:\nwrfcsdk"
USER ContainerUser

ENTRYPOINT ["powershell.exe", "C:\\build.ps1"]

# Default to master branch if no other command specified.
CMD ["master"]