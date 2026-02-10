$project = "phozwrgnozhgtvierqmv"
$pass = "Muneebtech321%40%23%40%23"
$regions = @("us-east-1", "ap-southeast-1", "eu-central-1", "ap-south-1")

foreach ($region in $regions) {
    Write-Host "Testing $region..."
    $url = "postgresql://postgres.$project:$pass@aws-0-$region.pooler.supabase.com:5432/postgres"
    $env:DATABASE_URL = $url
    $env:DIRECT_URL = $url
    npx prisma db push --accept-data-loss | Out-Null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "SUCCESS! Region is $region"
        Write-Host "URL: $url"
        exit 0
    }
}
Write-Host "All regions failed."
exit 1
