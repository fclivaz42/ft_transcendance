rm -rf /var/www/sarif-frontend/*
for file in /app/*; do
	mv $file /var/www/sarif-frontend
done
exit 0
