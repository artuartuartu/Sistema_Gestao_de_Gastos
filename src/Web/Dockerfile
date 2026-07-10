FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build-env
WORKDIR /app

COPY src/Domain/ ./src/Domain/
COPY src/Application/ ./src/Application/
COPY src/Infrastructure/ ./src/Infrastructure/
COPY src/Web/ ./src/Web/

RUN dotnet restore src/Web/*.csproj

RUN dotnet publish src/Web/*.csproj -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app

RUN mkdir -p /app/data
COPY --from=build-env /app/out .

EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000

ENTRYPOINT ["dotnet", "Sistema_Gestao_de_Gastos.Web.dll"]