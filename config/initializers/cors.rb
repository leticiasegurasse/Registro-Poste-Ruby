Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "http://localhost:3000",
            "http://172.30.209.20/",
            "http://yourwebsite.production.app",
            /\Ahttps:\/\/deploy-preview-\d{1,4}--yourwebsite\.domain\.app\z/

    resource "*",
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true,
      max_age: 86400
  end
end