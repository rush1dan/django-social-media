# Generated by Django 4.2.6 on 2023-10-19 07:41

import apps.user.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to=apps.user.models.user_image),
        ),
    ]
