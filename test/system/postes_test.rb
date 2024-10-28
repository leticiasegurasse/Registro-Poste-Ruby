require "application_system_test_case"

class PostesTest < ApplicationSystemTestCase
  setup do
    @poste = postes(:one)
  end

  test "visiting the index" do
    visit postes_url
    assert_selector "h1", text: "Postes"
  end

  test "should create poste" do
    visit postes_url
    click_on "New poste"

    fill_in "Bairro", with: @poste.bairro_id
    fill_in "Cidade", with: @poste.cidade_id
    fill_in "Data registro", with: @poste.data_registro
    fill_in "Foto", with: @poste.foto
    fill_in "Localizacao utm x", with: @poste.localizacao_utm_x
    fill_in "Localizacao utm y", with: @poste.localizacao_utm_y
    fill_in "Observacoes", with: @poste.observacoes
    fill_in "Users", with: @poste.users_id
    fill_in "Zonautm", with: @poste.zonautm
    click_on "Create Poste"

    assert_text "Poste was successfully created"
    click_on "Back"
  end

  test "should update Poste" do
    visit poste_url(@poste)
    click_on "Edit this poste", match: :first

    fill_in "Bairro", with: @poste.bairro_id
    fill_in "Cidade", with: @poste.cidade_id
    fill_in "Data registro", with: @poste.data_registro
    fill_in "Foto", with: @poste.foto
    fill_in "Localizacao utm x", with: @poste.localizacao_utm_x
    fill_in "Localizacao utm y", with: @poste.localizacao_utm_y
    fill_in "Observacoes", with: @poste.observacoes
    fill_in "Users", with: @poste.users_id
    fill_in "Zonautm", with: @poste.zonautm
    click_on "Update Poste"

    assert_text "Poste was successfully updated"
    click_on "Back"
  end

  test "should destroy Poste" do
    visit poste_url(@poste)
    click_on "Destroy this poste", match: :first

    assert_text "Poste was successfully destroyed"
  end
end
