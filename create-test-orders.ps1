# Create test orders

$order1 = @{
    userId = "6910751c36e5802b44aef8d0"
    userName = "nour bayouli"
    userEmail = "nourbayouli54@gmail.com"
    items = @(
        @{
            productName = "Laptop"
            quantity = 1
            price = 999.99
            subtotal = 999.99
        },
        @{
            productName = "Mouse"
            quantity = 2
            price = 29.99
            subtotal = 59.98
        }
    )
    shippingAddress = @{
        street = "123 Main St"
        city = "Paris"
        postalCode = "75001"
        country = "France"
    }
    totalAmount = 1059.97
} | ConvertTo-Json -Depth 10

Write-Host "Creating first order..."
$response1 = Invoke-WebRequest -Uri "http://localhost:5000/api/orders" -Method Post -ContentType "application/json" -Body $order1 2>$null
$response1 | ConvertFrom-Json | ConvertTo-Json -Depth 3

# Second order
$order2 = @{
    userId = "691091b976b047312e3ce9a7"
    userName = "Bob Smith"
    userEmail = "bob@example.com"
    items = @(
        @{
            productName = "Keyboard"
            quantity = 1
            price = 79.99
            subtotal = 79.99
        }
    )
    shippingAddress = @{
        street = "456 Oak Ave"
        city = "Lyon"
        postalCode = "69000"
        country = "France"
    }
    totalAmount = 79.99
} | ConvertTo-Json -Depth 10

Write-Host "`nCreating second order..."
$response2 = Invoke-WebRequest -Uri "http://localhost:5000/api/orders" -Method Post -ContentType "application/json" -Body $order2 2>$null
$response2 | ConvertFrom-Json | ConvertTo-Json -Depth 3

# Third order
$order3 = @{
    userId = "691091c272b047312e3ce9aa"
    userName = "Carol White"
    userEmail = "carol@example.com"
    items = @(
        @{
            productName = "Monitor"
            quantity = 1
            price = 249.99
            subtotal = 249.99
        },
        @{
            productName = "HDMI Cable"
            quantity = 3
            price = 9.99
            subtotal = 29.97
        }
    )
    shippingAddress = @{
        street = "789 Elm St"
        city = "Marseille"
        postalCode = "13000"
        country = "France"
    }
    totalAmount = 279.96
} | ConvertTo-Json -Depth 10

Write-Host "`nCreating third order..."
$response3 = Invoke-WebRequest -Uri "http://localhost:5000/api/orders" -Method Post -ContentType "application/json" -Body $order3 2>$null
$response3 | ConvertFrom-Json | ConvertTo-Json -Depth 3

Write-Host "`n✅ All test orders created!"

# Fetch all orders
Write-Host "`n📋 Fetching all orders..."
Invoke-WebRequest -Uri "http://localhost:5000/api/admin/orders" 2>$null | ConvertFrom-Json | ConvertTo-Json -Depth 3
